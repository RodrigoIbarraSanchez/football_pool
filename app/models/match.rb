class Match < ApplicationRecord
  has_and_belongs_to_many :pools

  def display_name
    "#{home_team} vs #{away_team} - #{date.strftime('%d %b %Y')}"
  end
end
