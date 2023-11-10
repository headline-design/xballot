export const spaceStates = [
    {
    text: 'proposals.states.all',
    action: 'all',
    extras: { selected: stateFilter === 'all' }
    },
    {
        text: 'proposals.states.all',
        action: 'all',
        extras: { selected: stateFilter === 'all' }
      },
  
    {
        text: 'proposals.states.active',
        action: 'active',
        extras: { selected: stateFilter === 'active' }
      },
    {
        text: 'proposals.states.pending',
        action: 'pending',
        extras: { selected: stateFilter === 'pending' }
      },
    {
        text: 'proposals.states.closed',
        action: 'closed',
        extras: { selected: stateFilter === 'closed' }
    },
    {
    text: 'proposals.states.core',
    action: 'core',
    extras: { selected: stateFilter === 'core' }
    },

  ]