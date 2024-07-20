class Prediction < ApplicationRecord
  belongs_to :user
  belongs_to :match
  belongs_to :pool

  before_save :calculate_points, unless: :skip_points_calculation

  validate :match_not_started, on: [:create, :update]

  attr_accessor :skip_points_calculation

  def match_not_started
    return if user.admin?
    if match.status != "NS"
      errors.add(:base, "No se pueden guardar predicciones para partidos que ya han comenzado.")
    end
  end

  def calculate_points
    Rails.logger.debug "Calculating points for Prediction ID: #{self.id}, Match Status: #{self.match.status}"
    if self.match.status == 'FT'
      if self.home_team_score == self.match.home_team_score && self.away_team_score == self.match.away_team_score
        self.points = 5
      elsif (self.home_team_score <=> self.away_team_score) == (self.match.home_team_score <=> self.match.away_team_score)
        self.points = 3
      else
        self.points = 0
      end
    else
      self.points = 0
    end
    Rails.logger.debug "Prediction ID: #{self.id}, Calculated Points: #{self.points}"
  end

  def self.recalculate_points_for_match(match)
    Rails.logger.debug "Recalculating points for match ID: #{match.id}"
    match.predictions.each do |prediction|
      prediction.skip_points_calculation = true
      prediction.calculate_points
      if prediction.save
        Rails.logger.debug "Updated points for prediction ID: #{prediction.id}: #{prediction.points}"
      else
        Rails.logger.error "Failed to update points for prediction ID: #{prediction.id}: #{prediction.errors.full_messages.join(', ')}"
      end
    end
  end
end
