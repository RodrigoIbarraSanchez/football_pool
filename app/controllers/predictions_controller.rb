class PredictionsController < ApplicationController
  before_action :authenticate_user!

  def create
    pool_id = prediction_params[:pool_id].first

    prediction_params[:match_id].each_with_index do |match_id, index|
      Prediction.create(
        user_id: current_user.id,
        pool_id: pool_id,
        match_id: match_id,
        home_team_score: prediction_params[:home_team_score][index],
        away_team_score: prediction_params[:away_team_score][index]
      )
    end

    redirect_to pool_path(pool_id), notice: "Predictions submitted successfully."
  end

  private

  def prediction_params
    params.require(:prediction).permit(match_id: [], pool_id: [], home_team_score: [], away_team_score: [])
  end
end
