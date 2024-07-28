class Prediction < ApplicationRecord
  belongs_to :user
  belongs_to :match
  belongs_to :pool

  before_save :calculate_points, unless: :skip_validation

  validate :match_not_started, on: [:create, :update], unless: :skip_validation
  validates :user_id, uniqueness: { scope: [:match_id, :pool_id], message: "Ya has hecho una predicción para este partido.", on: :create }

  attr_accessor :skip_validation

  def match_not_started
    return if user.admin?
    if match.status != "NS" && match.status != "TBD"
      errors.add(:base, "No se pueden guardar predicciones para partidos que ya han comenzado.")
    end
  end

  def calculate_points
    if self.match.status == 'FT' || self.match.status == 'PEN'
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
  end

  def self.recalculate_points_for_match(match)
    match.predictions.each do |prediction|
      prediction.skip_validation = true
      prediction.calculate_points
      if prediction.save(validate: false)
        Rails.logger.debug "Updated points for prediction ID: #{prediction.id} - Points: #{prediction.points}"
      else
        Rails.logger.error "Failed to update points for prediction ID: #{prediction.id} - Errors: #{prediction.errors.full_messages.join(', ')}"
      end
    end
  end
end
