Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }
  
  resources :pools do
    member do
      match 'join', via: [:get, :post]
      get 'leaderboard'
    end
  end

  resources :predictions, only: [:create, :update]

  get "up" => "rails/health#show", as: :rails_health_check

  root 'pages#home'
  
  get 'matches/current_round', to: 'matches#current_round'
end
