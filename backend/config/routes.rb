Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post "auth/login", to: "auth#login"
      delete "auth/logout", to: "auth#logout"

      get "forum_threads", to: "forum_threads#all_threads"

      # Categories
      resources :categories, only: [:index, :show, :create] do
        # Nested routes for threads under categories
        resources :forum_threads, only: [:index, :create] # Index for threads in a category
      end

      # Forum Threads
      resources :forum_threads, only: [:show, :update, :destroy] do
        # Nested routes for comments under threads
        resources :comments, only: [:create, :destroy]

        # Routes for likes and chill votes
        member do
          patch :toggle_like
          patch :toggle_chill
        end
      end

      # Tags
      resources :tags, only: [:index, :show, :create]

      # Feed
      get "feed", to: "feed#index"

      # User profile
      get 'user', to: 'users#show'
      put 'user', to: 'users#update'
      patch 'user', to: 'users#update'

      delete 'user', to: 'users#destroy'

      resources :users, only: [:show] do
        member do
          get :followers
          get :following
          post :follow
          delete :unfollow
        end
      end
    end
  end

  # Root and Frontend Routes
  root "homepage#index"
  get "/*path" => "homepage#index"

  # Health Check
  get "up" => "rails/health#show", as: :rails_health_check

  # PWA Files
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
