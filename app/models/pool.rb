# == Schema Information
#
# Table name: pools
#
#  id            :integer          not null, primary key
#  title         :string
#  description   :string
#  raffle_winner :string
#  isStarted     :boolean
#  isFinished    :boolean
#  prize         :string
#  user_id       :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class Pool < ApplicationRecord
  has_and_belongs_to_many :users
  has_and_belongs_to_many :matches
  has_many :predictions
  belongs_to :user

  validates :title, presence: { message: "- El título es obligatorio" }
end
