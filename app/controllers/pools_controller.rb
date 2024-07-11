class PoolsController < ApplicationController
  before_action :set_pool, only: %i[show edit update destroy]
  before_action :authenticate_user!, except: %i[show index]
  before_action :authorize_pool_creation, only: %i[new create]

  def index
    @pools = Pool.all
  end

  def show
    @matches = @pool.matches
  end

  def new
    @pool = Pool.new
    @matches = Match.all # Asegúrate de que esta línea esté presente
    Rails.logger.debug "Matches loaded: #{@matches.inspect}" # Línea de depuración
  end
  
  def create
    authorize Pool
    logger.debug "Entering PoolsController#create"
    logger.debug "Pool Params: #{pool_params.inspect}"
  
    @pool = current_user.pools.build(pool_params)
  
    # Filtrar valores vacíos y convertir a enteros
    fixture_ids = pool_params[:match_ids].reject(&:blank?).map(&:to_i)
    logger.debug "Fixture IDs: #{fixture_ids}"
  
    matches = Match.where(fixture_id: fixture_ids) # Cambiado de :id a :fixture_id
    logger.debug "Matches Found: #{matches.pluck(:fixture_id)}"
    logger.debug "Matches Count: #{matches.count}"
  
    respond_to do |format|
      if @pool.save
        @pool.matches << matches
        format.html { redirect_to @pool, notice: "Pool was successfully created." }
        format.json { render :show, status: :created, location: @pool }
      else
        @matches = get_current_round_matches
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
      authorize Pool
    rescue Pundit::NotAuthorizedError
      flash[:alert] = "You are not authorized to perform this action."
      redirect_to(root_path)
    end

    def get_current_round_matches
      service = ApiFootballService.new
      season = 2024
      from = Date.today
      to = from + 7.days
      league = 262
      response = service.fixtures(season, from, to, league)
      logger.debug "API response: #{response.inspect}"
    
      if response.is_a?(Hash) && response["response"].present?
        current_round = response["response"].first.dig("league", "round")
        fixture_ids = response["response"]
                        .select { |match| match.dig("league", "round") == current_round }
                        .map { |match| match.dig("fixture", "id").to_i }
        
        logger.debug "Fixture IDs for current round: #{fixture_ids}"
    
        matches = Match.where(fixture_id: fixture_ids)
        logger.debug "Matches found: #{matches.pluck(:fixture_id)}"
        matches
      else
        []
      end
    end              

    def save_current_round_matches
      season = 2024
      from = Date.today
      to = from + 7.days
      league = 262
    
      api_service = ApiFootballService.new
      response = api_service.save_fixtures(season, from, to, league)
      logger.debug "API response: #{response.inspect}"
    
      if response.is_a?(Hash) && response["response"].present?
        fixtures = response["response"]
        fixtures.each do |fixture|
          fixture_id = fixture.dig("fixture", "id")
          next if fixture_id.nil? || fixture_id.to_s.empty?
    
          match = Match.find_or_initialize_by(fixture_id: fixture_id.to_i)
          match.attributes = {
            fixture_id: fixture_id.to_i,
            home_team: fixture.dig("teams", "home", "name"),
            away_team: fixture.dig("teams", "away", "name"),
            date: fixture.dig("fixture", "date")
          }
          match.save!
        end
      else
        logger.error "API response was nil or did not contain 'response'"
      end
    end                   
end
