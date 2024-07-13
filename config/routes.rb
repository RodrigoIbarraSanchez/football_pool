Rails.application.routes.draw do
  devise_for :users
  resources :pools do
    member do
      match 'join', via: [:get, :post]
    end
  resources :pools do
    member do
      get 'leaderboard'
    end
  end    
  end

  resources :predictions, only: [:create, :update]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


  # root "pools#index"
  root 'pages#home'
  
  get 'matches/current_round', to: 'matches#current_round'
end
