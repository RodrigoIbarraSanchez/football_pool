class PredictionsController < ApplicationController
  before_action :authenticate_user!

  def create
    pool_id = prediction_params[:pool_id].first

    ActiveRecord::Base.transaction do
      prediction_params[:match_id].each_with_index do |match_id, index|
        Prediction.create!(
          user_id: current_user.id,
          pool_id: pool_id,
          match_id: match_id,
          home_team_score: prediction_params[:home_team_score][index],
          away_team_score: prediction_params[:away_team_score][index]
        )
      end
    end

    redirect_to pool_path(pool_id), notice: "Predicciones guardadas."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to pool_path(pool_id), alert: "Hubo un error guardando tus predicciones: #{e.message}"
  end

  def update
    prediction = Prediction.find(params[:id])
    if prediction.update(prediction_update_params)
      redirect_to pool_path(prediction.pool_id), notice: "Predicción actualizada con éxito."
    else
      redirect_to pool_path(prediction.pool_id), alert: "Error actualizando predicción."
    end
  end

  private

  def prediction_params
    params.require(:prediction).permit(match_id: [], pool_id: [], home_team_score: [], away_team_score: [])
  end

  def prediction_update_params
    params.require(:prediction).permit(:home_team_score, :away_team_score)
  end
end
