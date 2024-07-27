Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    passwords: 'users/passwords',
    registrations: 'users/registrations',
    confirmations: 'users/confirmations',
    unlocks: 'users/unlocks',
  }

  resources :pools do
    member do
      match 'join', via: [:get, :post]
      get 'leaderboard', to: 'pools#leaderboard'
    end
  end

  devise_scope :user do
    delete 'logout', to: 'devise/sessions#destroy'
  end

  resources :predictions, only: [:create, :update]

  get "up" => "rails/health#show", as: :rails_health_check

  root 'pages#home'
  
  get 'matches/current_round', to: 'matches#current_round'
  get '/profile', to: 'users#profile', as: 'user_profile'
  get '/profile/edit', to: 'users#edit', as: 'edit_user_profile'
  get '/users/check_username', to: 'users#check_username'

  patch '/profile', to: 'users#update', as: 'update_user_profile'
end
