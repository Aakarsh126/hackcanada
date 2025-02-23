# #### Rails API Backend (Hack Canada 2025)

Backend for Hack Canada 2025. 
This mainly contains the APIs and the Database Structure. 

Deployment: https://localhost:3000

## Prerequisites

- **Ruby** 3.2.2
- **PostgreSQL** 14+ [Guide](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-ruby-on-rails-application-on-ubuntu-20-04)
- **Bundler** (`gem install bundler`)

## Setup

1. **Clone repository**
   
   ```
   git clone TBD
   cd TBD
   ```
   

3. **Install Dependencies**
   
   ```
   bundle install
   ```
   
4. **Create Database**

    ```
    rails db:create
    ```
   
4. **Run the Development Environment**
  
    ```
    bin/dev
    ```

## Important Folders / Files

1. ```app/models```: Contains all the models
2. ```app/controllers/api/v1```: Contains all the controllers
3. ```db/seeds.rb```: Optional seed to run to test the app (using ```rails db:seed```)
4. ```db/schema.rb```: Database Schema


