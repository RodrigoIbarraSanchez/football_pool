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
require "test_helper"

class PoolTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
