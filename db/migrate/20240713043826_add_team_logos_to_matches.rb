class AddTeamLogosToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :home_team_logo, :string
    add_column :matches, :away_team_logo, :string
  end
end
