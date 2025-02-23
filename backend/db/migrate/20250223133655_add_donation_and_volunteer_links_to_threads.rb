class AddDonationAndVolunteerLinksToThreads < ActiveRecord::Migration[7.2]
  def change
    add_column :forum_threads, :donation_link, :string
    add_column :forum_threads, :volunteer_link, :string
  end
end
