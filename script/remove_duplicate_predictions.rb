# script/remove_duplicate_predictions.rb

Prediction.select(:user_id, :match_id, :pool_id)
          .group(:user_id, :match_id, :pool_id)
          .having("count(*) > 1")
          .each do |duplicate|
  predictions = Prediction.where(user_id: duplicate.user_id, match_id: duplicate.match_id, pool_id: duplicate.pool_id)
  predictions.offset(1).destroy_all
end