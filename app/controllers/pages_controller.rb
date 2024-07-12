class PagesController < ApplicationController
  def home
    @pools = Pool.all
    @current_user = current_user
    @notice = flash[:notice]

    props = {
      pools: @pools.map { |pool| { 
        id: pool.id, 
        title: pool.title, 
        description: pool.description, 
        user_id: pool.user_id, 
        created_at: pool.created_at, 
        updated_at: pool.updated_at,
        raffle_winner: pool.raffle_winner,
        isStarted: pool.isStarted,
        isFinished: pool.isFinished,
        prize: pool.prize
      } },
      notice: @notice,
      userSignedIn: user_signed_in?,
      currentUser: @current_user ? { id: @current_user.id, admin: @current_user.admin? } : nil
    }.to_json

    @props = props
  end
end
