class CreateJoinTablePoolsMatches < ActiveRecord::Migration[7.0]
  def change
    create_join_table :pools, :matches do |t|
      t.index [:pool_id, :match_id]
      t.index [:match_id, :pool_id]
    end
  end
end