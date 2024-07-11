class AddFixtureIdToMatches < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :fixture_id, :integer, null: false
    add_index :matches, :fixture_id, unique: true
  end
end
