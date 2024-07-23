class AddWinnersToPools < ActiveRecord::Migration[7.1]
  def change
    add_column :pools, :first_place_winner_id, :integer
    add_column :pools, :second_place_winner_id, :integer
    add_column :pools, :third_place_winner_id, :integer
  end
end
