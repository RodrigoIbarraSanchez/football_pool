json.extract! pool, :id, :title, :description, :raffle_winner, :isStarted, :isFinished, :prize, :user_id, :created_at, :updated_at
json.url pool_url(pool, format: :json)
