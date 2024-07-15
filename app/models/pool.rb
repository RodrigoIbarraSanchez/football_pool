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
  belongs_to :user
  has_and_belongs_to_many :matches
  has_and_belongs_to_many :users, join_table: :pools_users
  has_many :predictions, dependent: :destroy

  validates :title, presence: { message: "- El título es obligatorio" }
  validates :description, presence: true
  validates :user, presence: true
end
