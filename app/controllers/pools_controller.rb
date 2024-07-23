class PoolsController < ApplicationController
  include Rails.application.routes.url_helpers

  before_action :save_current_round_matches, only: %i[new create]
  before_action :set_pool, only: %i[show edit update destroy join]
  before_action :authenticate_user!, except: %i[show index]
  before_action :authorize_pool_creation, only: %i[new create]
  before_action :load_matches, only: %i[new create edit update]

  def index
    @pools = Pool.all
    @current_user = current_user
    Rails.logger.debug "Pools: #{@pools.inspect}"
  end

  def show
    api_service = ApiFootballService.new

    @pool.matches.each do |match|
      if match.status != "FT"
        api_service.update_fixture(match.fixture_id)
        match.reload
      end
    end

    api_service.update_live_fixtures

    @pool.reload
    @matches = @pool.matches
    @user_is_creator = current_user == @pool.user if current_user
    @user_is_participant = @pool.users.include?(current_user) if current_user

    @matches.each do |match|
      if match.status == "FT"
        Prediction.recalculate_points_for_match(match)
      end
    end

    participants = @pool.users.includes(:predictions).map do |user|
      {
        id: user.id,
        email: user.email,
        predictions: user.predictions.where(pool: @pool).map do |prediction|
          {
            match_id: prediction.match_id,
            home_team_score: prediction.home_team_score,
            away_team_score: prediction.away_team_score,
            points: prediction.points
          }
        end
      }
    end

    Rails.logger.debug "Participants: #{participants}"

    current_user_data = if current_user
                          {
                            id: current_user.id,
                            predictions: current_user.predictions.map do |p|
                              {
                                match_id: p.match_id,
                                home_team_score: p.home_team_score,
                                away_team_score: p.away_team_score
                              }
                            end
                          }
                        else
                          {}
                        end

    props = {
      pool: {
        id: @pool.id,
        title: @pool.title,
        description: @pool.description,
        raffle_winner: @pool.raffle_winner,
        isStarted: @pool.isStarted,
        isFinished: @pool.isFinished,
        prize: @pool.prize,
        user_id: @pool.user_id,
        created_at: @pool.created_at,
        updated_at: @pool.updated_at,
        matches: @matches.map do |match|
          {
            id: match.id,
            home_team: match.home_team,
            home_team_logo: match.home_team_logo,
            away_team: match.away_team,
            away_team_logo: match.away_team_logo,
            date: match.date,
            home_team_score: match.home_team_score,
            away_team_score: match.away_team_score,
            status: match.status,
            elapsed: match.elapsed
          }
        end,
        participants: participants
      },
      userIsCreator: @user_is_creator || false,
      userIsParticipant: @user_is_participant || false,
      currentUser: current_user_data
    }.to_json

    Rails.logger.debug "Props: #{props}"

    @props = props
  end

  def new
    @pool = Pool.new
    @matches = get_current_round_matches
    Rails.logger.debug "Matches loaded: #{@matches.inspect}" # Línea de depuración
  end
  
  def create
    authorize Pool
    logger.debug "Entering PoolsController#create"
    logger.debug "Pool Params: #{pool_params.inspect}"
    logger.debug "Current User: #{current_user.inspect}"

    @pool = current_user.pools.build(pool_params)
    @pool.user = current_user
    logger.debug "Pool Built: #{@pool.inspect}"

    # Filtrar valores vacíos y convertir a enteros
    match_ids = pool_params[:match_ids].reject(&:blank?).map(&:to_i)
    logger.debug "Match IDs: #{match_ids}"

    matches = Match.where(id: match_ids)
    logger.debug "Matches Found: #{matches.pluck(:id)}"
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

  def join
    @pool.users << current_user unless @pool.users.include?(current_user)
    redirect_to @pool, notice: "¡Listo! Ahora eres parte de la quiniela."
  end

  def leaderboard
    @pool = Pool.find(params[:id])
    @participants = @pool.users.select("users.*, SUM(predictions.points) AS total_points")
                              .joins(:predictions)
                              .group("users.id")
                              .order("total_points DESC")

    respond_to do |format|
      format.html do
        props = {
          pool: {
            id: @pool.id,
            title: @pool.title,
            description: @pool.description,
            prize: @pool.prize,
          },
          participants: @participants.map do |participant|
            {
              id: participant.id,
              email: participant.email,
              username: participant.username,
              first_name: participant.first_name,
              last_name: participant.last_name,
              phone: participant.phone,
              profile_picture_url: participant.profile_picture.attached? ? url_for(participant.profile_picture) : nil,
              total_points: participant.total_points,
              predictions: participant.predictions.where(pool: @pool).map do |prediction|
                {
                  match_id: prediction.match_id,
                  home_team_score: prediction.home_team_score,
                  away_team_score: prediction.away_team_score,
                  points: prediction.points,
                }
              end
            }
          end
        }.to_json

        render html: "<div id='react-root' data-props='#{props}'></div>".html_safe
      end
      format.json do
        render json: {
          pool: {
            id: @pool.id,
            title: @pool.title,
            description: @pool.description,
            prize: @pool.prize,
          },
          participants: @participants.map do |participant|
            {
              id: participant.id,
              email: participant.email,
              username: participant.username,
              first_name: participant.first_name,
              last_name: participant.last_name,
              phone: participant.phone,
              profile_picture_url: participant.profile_picture.attached? ? url_for(participant.profile_picture) : nil,
              total_points: participant.total_points,
              predictions: participant.predictions.where(pool: @pool).map do |prediction|
                {
                  match_id: prediction.match_id,
                  home_team_score: prediction.home_team_score,
                  away_team_score: prediction.away_team_score,
                  points: prediction.points,
                }
              end
            }
          end
        }
      end
    end
  end

  private

    def set_pool
      @pool = Pool.find_by(id: params[:id])
      unless @pool
        Rails.logger.error "Pool with ID #{params[:id]} not found"
        flash[:alert] = "Pool not found"
        redirect_to root_path
      end
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
      today = Date.today
      start_of_week = today.beginning_of_week(:monday)
      end_of_week = today.end_of_week(:sunday)
      league = 772
      
      logger.debug "Fetching fixtures from #{start_of_week} to #{end_of_week} for league #{league}"
      
      response = service.fixtures(season, start_of_week, end_of_week, league)
      logger.debug "API response: #{response.inspect}"
      
      if response.is_a?(Hash) && response["response"].present?
        fixture_ids = response["response"]
                      .select { |match| match.dig("fixture", "status", "short") == "NS" }
                      .map { |match| match.dig("fixture", "id").to_i }
        
        logger.debug "Fixture IDs for matches with status 'NS': #{fixture_ids}"
        
        matches = Match.where(fixture_id: fixture_ids)
                       .where(date: start_of_week..end_of_week)  # Filtra los partidos de la semana actual
        logger.debug "Matches found: #{matches.pluck(:fixture_id)}"
        matches
      else
        logger.debug "No valid response from API or no matches found"
        []
      end
    end                   

    def save_current_round_matches
      logger.debug "Entering save_current_round_matches"
      
      season = 2024
      from = Date.today
      to = from + 7.days
      league = 772
    
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
            home_team: fixture.dig("teams", "home", "name"),
            away_team: fixture.dig("teams", "away", "name"),
            date: fixture.dig("fixture", "date"),
            venue: fixture.dig("fixture", "venue", "name"),
            city: fixture.dig("fixture", "venue", "city"),
            league_id: fixture.dig("league", "id"),
            home_team_logo: fixture.dig("teams", "home", "logo"),
            away_team_logo: fixture.dig("teams", "away", "logo")
          }
          if match.save
            logger.debug "Match saved: #{match.inspect}"
          else
            logger.error "Failed to save match: #{match.errors.full_messages.join(', ')}"
          end
        end
      else
        logger.error "API response was nil or did not contain 'response'"
      end
      
      logger.debug "Exiting save_current_round_matches"
    end       

    def load_matches
      @matches = Match.all
    end
end
