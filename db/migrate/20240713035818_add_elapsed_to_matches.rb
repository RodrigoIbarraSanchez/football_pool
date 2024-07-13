class AddElapsedToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :elapsed, :integer
  end
end
