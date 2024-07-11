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
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :predictions
  has_and_belongs_to_many :pools
  has_many :created_pools, class_name: 'Pool', foreign_key: 'user_id'

  enum role: { regular: 'regular', admin: 'admin' }

  after_initialize :set_default_role, if: :new_record?

  private

  def set_default_role
    self.role ||= :regular
  end
end
