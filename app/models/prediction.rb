class Prediction < ApplicationRecord
  belongs_to :user
  belongs_to :match
  belongs_to :pool

  before_save :calculate_points

  validate :match_not_started, on: [:create, :update]

  def match_not_started
    return if user.admin? 
    if match.status != "NS"
      errors.add(:base, "No se pueden guardar predicciones para partidos que ya han comenzado.")
    end
  end

  def calculate_points
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
  end

  def self.recalculate_points_for_match(match)
    match.predictions.each(&:calculate_points)
    match.predictions.each(&:save)
  end
end
