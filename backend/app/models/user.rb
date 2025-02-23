class User < ApplicationRecord
  has_many :reactions, dependent: :destroy
  validates :username, presence: true, uniqueness: true
  validates :email, 
    uniqueness: { allow_blank: true },
    format: { 
      with: URI::MailTo::EMAIL_REGEXP, 
      allow_blank: true 
    }

  # Relationships
  has_many :forum_threads, dependent: :destroy
  has_many :comments, dependent: :destroy

  # Preferences configuration
  store_accessor :preferences, :categories, :tags, :notifications
  before_save :set_default_preferences

  # Follow relationships
  has_many :follows_as_follower, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :follows_as_followed, class_name: 'Follow', foreign_key: 'followed_user_id', dependent: :destroy
  
  has_many :following, through: :follows_as_follower, source: :followed_user
  has_many :followers, through: :follows_as_followed, source: :follower


  def followers_count
    followers.count
  end

  def following_count
    following.count
  end

  def following?(user)
    following.include?(user)
  end

  private

  def set_default_preferences
    self.preferences ||= {
      categories: [],
      tags: [],
      notifications: {
        push: true
      }
    }
  end
end