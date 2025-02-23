class AddImpactAreasToCategories < ActiveRecord::Migration[7.0]
  def change
    impact_areas = [
      { name: 'Environmental Protection', description: 'Focus on climate change, wildlife conservation, and clean energy.' },
      { name: 'Community Development', description: 'Local volunteering opportunities and neighborhood improvements.' },
      { name: 'Social Justice and Equality', description: 'Advocacy for racial justice, gender equality, and LGBTQ+ rights.' },
      { name: 'Health and Well-being', description: 'Promoting mental health and access to healthcare services.' },
      { name: 'Education and Literacy', description: 'Programs to enhance youth mentorship and adult education.' },
      { name: 'Economic Empowerment', description: 'Job training and financial literacy initiatives.' },
      { name: 'Food Security', description: 'Community gardens and sustainable agriculture practices.' },
      { name: 'Digital and Technological Literacy', description: 'Bridging the digital divide and promoting online safety.' },
      { name: 'Indigenous Rights and Reconciliation', description: 'Supporting Indigenous communities and promoting their culture.' },
      { name: 'Crisis Response', description: 'Disaster relief and support for refugees and asylum seekers.' },
      { name: 'Animal Welfare', description: 'Advocacy for animal rights and wildlife protection.' }
    ]

    impact_areas.each do |area|
      Category.create(area)
    end
  end
end
