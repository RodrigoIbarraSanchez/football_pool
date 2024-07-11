class PoolsController < ApplicationController
  before_action :set_pool, only: %i[ show edit update destroy ]
  before_action :authenticate_user!, except: [ :show, :index ]
  before_action :authorize_pool_creation, only: [:new, :create]

  def index
    @pools = Pool.all
  end

  def show
  end

  def new
    logger.debug "Entering PoolsController#new"
    @pool = Pool.new
    save_current_round_matches
    @matches = get_current_round_matches
  end
  
  def create
    authorize Pool
    logger.debug "Entering PoolsController#create"
    logger.debug "Pool Params: #{pool_params.inspect}"

    @pool = current_user.pools.build(pool_params)

    # Filtrar valores vacíos y convertir a enteros
    fixture_ids = pool_params[:match_ids].reject(&:blank?).map(&:to_i)
    logger.debug "Fixture IDs: #{fixture_ids}"

    matches = Match.where(fixture_id: fixture_ids)
    logger.debug "Matches Found: #{matches.pluck(:fixture_id)}"
    logger.debug "Matches Count: #{matches.count}"

    respond_to do |format|
      if @pool.save
        @pool.matches << matches
        format.html { redirect_to @pool, notice: "Pool was successfully created." }
        format.json { render :show, status: :created, location: @pool }
      else
        @matches = Match.all
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @pool.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @matches = get_current_round_matches
  end

  def update
    respond_to do |format|
      if @pool.update(pool_params)
        format.html { redirect_to @pool, notice: "Pool was successfully updated." }
        format.json { render :show, status: :ok, location: @pool }
      else
        @matches = get_current_round_matches
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @pool.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @pool.destroy!
    respond_to do |format|
      format.html { redirect_to pools_url, notice: "Pool was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_pool
      @pool = Pool.find(params[:id])
    end

    def pool_params
      params.require(:pool).permit(:title, :description, :raffle_winner, :isStarted, :isFinished, :prize, match_ids: [])
    end

    def authorize_pool_creation
      logger.debug "Authorizing pool creation"
      authorize Pool
    rescue Pundit::NotAuthorizedError
      flash[:alert] = "You are not authorized to perform this action."
      redirect_to(root_path)
    end

    def get_current_round_matches
      service = ApiFootballService.new
      season = 2024
      from = Date.today
      to = from + (7 - from.wday) # Obtener el próximo domingo
      league = 262
      response = service.fixtures(season, from, to, league)
    
      if response["response"].present?
        current_round = response["response"].first.dig("league", "round")
        fixture_ids = response["response"]
                          .select { |match| match.dig("league", "round") == current_round }
                          .map { |match| match.dig("fixture", "id") }
    
        Match.where(fixture_id: fixture_ids)
      else
        []
      end
    end

    def save_current_round_matches
      season = "2023" # Ajusta esto al valor correcto
      from = "2023-07-01" # Ajusta esto al rango de fechas correcto
      to = "2023-07-31" # Ajusta esto al rango de fechas correcto
      league = 262 # Ajusta esto al ID de la liga correcta
  
      api_service = ApiFootballService.new
      api_service.save_fixtures(season, from, to, league)
    end
end