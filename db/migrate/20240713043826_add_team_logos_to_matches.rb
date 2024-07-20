class AddTeamLogosToMatches < ActiveRecord::Migration[7.1]
  def change
    unless column_exists?(:matches, :home_team_logo)
      add_column :matches, :home_team_logo, :string
    end
    unless column_exists?(:matches, :away_team_logo)
      add_column :matches, :away_team_logo, :string
    end
  end
end
