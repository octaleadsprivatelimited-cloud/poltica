import { supabaseAdmin } from '@sarpanch-campaign/lib';
import shortid from 'shortid';

async function seed() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not available');
    process.exit(1);
  }

  console.log('🌱 Starting database seed...');

  try {
    // Create roles
    console.log('Creating roles...');
    // Roles are created via enum in migration

    // Create candidate admin profile
    console.log('Creating candidate admin...');
    const { data: candidateProfile, error: candidateError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000001', // Mock UUID
        name: 'Sarpanch Candidate',
        phone: '+919876543210',
        role: 'candidate',
      })
      .select()
      .single();

    if (candidateError) {
      console.error('Error creating candidate:', candidateError);
    } else {
      console.log('✅ Candidate created:', candidateProfile.id);
    }

    // Create 5 member profiles
    console.log('Creating team members...');
    const members = [
      { name: 'Team Member 1', phone: '+919876543211' },
      { name: 'Team Member 2', phone: '+919876543212' },
      { name: 'Team Member 3', phone: '+919876543213' },
      { name: 'Team Member 4', phone: '+919876543214' },
      { name: 'Team Member 5', phone: '+919876543215' },
    ];

    const { data: memberProfiles, error: membersError } = await supabaseAdmin
      .from('profiles')
      .insert(
        members.map((member, index) => ({
          user_id: `00000000-0000-0000-0000-00000000000${index + 2}`,
          name: member.name,
          phone: member.phone,
          role: 'member',
        }))
      )
      .select();

    if (membersError) {
      console.error('Error creating members:', membersError);
    } else {
      console.log(`✅ Created ${memberProfiles?.length || 0} members`);
    }

    // Create 7,000 audience members
    console.log('Creating audience data...');
    const wards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const booths = ['A', 'B', 'C', 'D', 'E'];
    const tags = ['voter', 'supporter', 'undecided', 'opposition', 'elderly', 'youth', 'farmer', 'business'];

    const audienceData = [];
    for (let i = 0; i < 7000; i++) {
      const ward = wards[Math.floor(Math.random() * wards.length)];
      const booth = booths[Math.floor(Math.random() * booths.length)];
      const whatsappCapable = Math.random() < 0.65; // 65% have WhatsApp
      const optedOut = Math.random() < 0.05; // 5% opted out
      
      // Random tags (1-3 tags per person)
      const numTags = Math.floor(Math.random() * 3) + 1;
      const personTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, numTags);

      audienceData.push({
        name: `Villager ${i + 1}`,
        phone: `+9198765${String(i).padStart(5, '0')}`,
        ward,
        booth,
        tags: personTags,
        whatsapp_capable: whatsappCapable,
        opted_out: optedOut,
      });
    }

    // Insert in batches of 1000
    const batchSize = 1000;
    for (let i = 0; i < audienceData.length; i += batchSize) {
      const batch = audienceData.slice(i, i + batchSize);
      const { error: audienceError } = await supabaseAdmin
        .from('audience')
        .insert(batch);

      if (audienceError) {
        console.error(`Error creating audience batch ${i / batchSize + 1}:`, audienceError);
      } else {
        console.log(`✅ Created audience batch ${i / batchSize + 1} (${batch.length} records)`);
      }
    }

    // Create sample templates
    console.log('Creating templates...');
    const templates = [
      {
        name: 'Welcome Message',
        channel: 'whatsapp',
        content: 'Namaste! I am {{candidate_name}}, your local candidate. I would love to hear your concerns and work for our village. Reply STOP to opt out.',
        variables: ['candidate_name'],
        approved: true,
        created_by: candidateProfile?.id,
      },
      {
        name: 'Event Invitation',
        channel: 'whatsapp',
        content: 'Join us for a village meeting on {{date}} at {{location}}. Your voice matters! Reply STOP to opt out.',
        variables: ['date', 'location'],
        approved: true,
        created_by: candidateProfile?.id,
      },
      {
        name: 'SMS Reminder',
        channel: 'sms',
        content: 'Don\'t forget to vote on {{date}}. Every vote counts for our village\'s future!',
        variables: ['date'],
        approved: true,
        created_by: candidateProfile?.id,
      },
      {
        name: 'IVR Script',
        channel: 'ivr',
        content: 'Namaste! This is {{candidate_name}} calling to share my vision for our village. Press 1 to hear more, 2 to speak with our team, or 3 to opt out.',
        variables: ['candidate_name'],
        approved: true,
        created_by: candidateProfile?.id,
      },
    ];

    const { data: templateData, error: templateError } = await supabaseAdmin
      .from('templates')
      .insert(templates)
      .select();

    if (templateError) {
      console.error('Error creating templates:', templateError);
    } else {
      console.log(`✅ Created ${templateData?.length || 0} templates`);
    }

    // Create sample campaign
    console.log('Creating sample campaign...');
    const { data: campaignData, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        name: 'Ward 5 Introduction Campaign',
        description: 'Introduction campaign for Ward 5 residents',
        channel_order: ['whatsapp', 'ivr', 'sms'],
        target_filter: { ward: '5' },
        utm: { source: 'wa', campaign: 'intro' },
        created_by: candidateProfile?.id,
      })
      .select()
      .single();

    if (campaignError) {
      console.error('Error creating campaign:', campaignError);
    } else {
      console.log('✅ Created sample campaign:', campaignData.id);
    }

    // Create sample tasks
    console.log('Creating sample tasks...');
    const tasks = [
      {
        title: 'Visit Ward 1 - Booth A',
        description: 'Door-to-door campaign in Ward 1, Booth A area',
        status: 'open',
        assigned_to: memberProfiles?.[0]?.id,
        created_by: candidateProfile?.id,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      },
      {
        title: 'Organize Village Meeting',
        description: 'Plan and organize a village meeting for next week',
        status: 'in_progress',
        assigned_to: memberProfiles?.[1]?.id,
        created_by: candidateProfile?.id,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      },
      {
        title: 'Update Campaign Materials',
        description: 'Update flyers and banners with latest information',
        status: 'open',
        created_by: candidateProfile?.id,
      },
    ];

    const { data: taskData, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert(tasks)
      .select();

    if (taskError) {
      console.error('Error creating tasks:', taskError);
    } else {
      console.log(`✅ Created ${taskData?.length || 0} tasks`);
    }

    // Create sample events
    console.log('Creating sample events...');
    const events = [
      {
        title: 'Village Meeting',
        description: 'Monthly village meeting to discuss local issues',
        start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        location: 'Village Community Center',
        created_by: candidateProfile?.id,
      },
      {
        title: 'Youth Rally',
        description: 'Rally to engage with young voters',
        start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        location: 'Village Ground',
        created_by: candidateProfile?.id,
      },
    ];

    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .insert(events)
      .select();

    if (eventError) {
      console.error('Error creating events:', eventError);
    } else {
      console.log(`✅ Created ${eventData?.length || 0} events`);
    }

    console.log('🎉 Database seed completed successfully!');
    console.log('\nSummary:');
    console.log('- 1 candidate profile');
    console.log('- 5 member profiles');
    console.log('- 7,000 audience members');
    console.log('- 4 templates (WhatsApp, SMS, IVR)');
    console.log('- 1 sample campaign');
    console.log('- 3 sample tasks');
    console.log('- 2 sample events');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();
