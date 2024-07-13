class AddPointsToPredictions < ActiveRecord::Migration[7.1]
  def change
    add_column :predictions, :points, :integer
  end
end
