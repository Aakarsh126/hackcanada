class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :forum_thread
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: :parent_id, dependent: :destroy

  # Automatically set forum_thread from parent if it's a reply
  before_validation :set_forum_thread_from_parent, if: :parent

  enum mood: {
    friendly: 0,
    thoughtful: 1,
    funny: 2,
    helpful: 3,
    insightful: 4,
    excited: 5
  }, _prefix: true

  validates :content, presence: true
  validates :forum_thread, presence: true

  scope :recent, -> { order(created_at: :desc) } # Sort by most recent first


  private

  def set_forum_thread_from_parent
    self.forum_thread ||= parent.forum_thread
  end

  
end