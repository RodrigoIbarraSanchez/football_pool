# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :predictions, dependent: :destroy
  has_and_belongs_to_many :pools, join_table: :pools_users, dependent: :destroy
  has_many :created_pools, class_name: 'Pool', foreign_key: 'user_id', dependent: :destroy
  has_one_attached :profile_picture

  enum role: { regular: 'regular', admin: 'admin' }

  after_initialize :set_default_role, if: :new_record?

  validates :username, presence: true, uniqueness: true
  validates :phone, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true

  private

  def set_default_role
    self.role ||= :regular
  end
end
