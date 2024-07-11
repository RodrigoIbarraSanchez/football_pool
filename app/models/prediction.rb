class Prediction < ApplicationRecord
  belongs_to :user
  belongs_to :pool
  belongs_to :match
end
