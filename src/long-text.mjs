
export default {
  Application: {
    ContextMenu: {
      Menu: {
        Text: 'Menu',
        Title: 'Show application main menu',
      },
    },

    Scene: {
      Menu: {
        Play: {
          Text: 'Play',
          Title: 'Start playing',
        },
        Editor: {
          Text: 'Editor',
          Title: 'Open editor',
        },
      },
      Editor: {
        ContextMenu: {
          Mode: {
            Text: 'Mode: ',
            Title: 'Switch editor modes',
          },
        },

        Mode: {
          ContextMenu: {
            Text: 'Mode: ',
            Title: 'Show application main menu',
          },
          Normal: {
            Description: 'Mode for view w/o editing',
            Load: {
              ContextMenu: {
                Text: 'Load',
                Title: 'Load game map',
              },
            },
            Save: {
              ContextMenu: {
                Text: 'Save',
                Title: 'Save game map',
              },
            }
          },
          Waypoints: {
            Description: 'Define waypoints locations and segments',
            ShowSetDefaultSegment: {
              ContextMenu: {
                Text: 'Def. Seg.: ',
                Title: 'Set default segment for new waypoints',
              },

            },
            ShowSetWaypointSegment: {
              ContextMenu: {
                Text: 'Wp Seg.: ',
                Title: 'Show current waypoint segment and change it on click',
              },
            },
            DeleteWaypoint: {
              ContextMenu: {
                Text: 'Delete',
                Title: 'Permanently delete waypoint',
              },
              Confirm: 'Are you sure?'
            },
          },
          Connections: {
            Description: 'Define waypoints connections',
            Default: {
              Directed: {
                Text: 'Def. Directed',
                Title: 'Directed connections will creates by default',
              },
              NonDirected: {
                Text: 'Def. Non-directed',
                Title: 'Non-directed connections will creates by default',
              },
            },
            Selection: {
              Directed: {
                Toggle: {
                  Directed: {
                    Text: 'Directed',
                    Title: 'Set directed mode to Directed for selected waypoint'
                  },
                  NonDirected: {
                    Text: 'Non-directed',
                    Title: 'Set directed mode to Non-directed for selected waypoint',
                  },
                },
                Reverse: {
                  Text: 'Reverse',
                  Title: 'Switch direction for directed connection',
                },
              },
              Next: {
                Text: 'Next',
                Title: 'Select next connection for this waypoint',
              },
              Delete: {
                Text: 'Delete',
                Title: 'Delete selected connection',
              },
              Cancel: {
                Text: 'Cancel',
                Title: 'Cancel connection selection',
              },
            },
            Connection: {
              Text: 'Connection ',
              Title: 'Select connection to edit',
            }
          },
          Settings: {
            Description: 'Common settings',
            SetStarting: {
              Text: 'Set starting for segment ',
              Title: 'Set player start point for specified segment at this waypoint',
            },
            UnsetStarting: {
              Text: 'Unset starting for segment ',
              Title: 'Unset player start point for specified segment',
            }
          }
        },
      },
      Game: {},
      Pentacle: {
        ContextMenu: {
          Player: {
            Text: 'Player ',
            Title: 'Select player by click to move',
          },
          Reset: {
            Text: 'Reset',
            Title: 'Reset the game'
          },
          Turn: {
            Text: 'Turn',
            Title: 'Move to specified or random number of steps'
          },
          Stats: {
            Text: 'Stats',
            Title: 'Show player statistics'
          },
        },

        Player: 'Player',
        Segment: 'Segment: ',
        Stones: 'Stones:',
        Runes: 'Runes',
        Events: 'Events',
        Lines: 'Lines',

        Dice: {
          Value: 'Dice value',
          Cancel: 'cancel to random',
          Result: 'Dice result: ',
        },

        EndPhaseQuestion: 'Do you wish moving over pentacle lines?',
        EndSceneAlert: 'Scene has been finished!',
      },
    },
  },
};
