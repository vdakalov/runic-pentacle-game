
export const EditorTheme = {
  Waypoint: {
    /**
     * Waypoints square size and color by segments
     */
    SegmentStyle: {
      RingOuter: {
        size: 16,
        color: '#314026'
      },
      RingMiddle: {
        size: 16,
        color: '#739559'
      },
      RingInner: {
        size: 16,
        color: '#b5ea8c'
      },
      Element: {
        size: 16,
        color: '#1684c9'
      },
      Line: {
        size: 16,
        color: '#8bc2e4'
      },
      Event: {
        size: 16,
        color: '#fb3f1e'
      }
    },
    /**
     * Starting waypoint marks
     */
    StartingMarks: {
      RingOuter: {
        size: 6,
        color: '#ffffff'
      },
      RingMiddle: {
        size: 4,
        color: '#afafaf'
      },
      RingInner: {
        size: 2,
        color: '#6f6f6f'
      }
    },
    /**
     * Change waypoint square size on pointer hover
     */
    ResizeOnHover: 1.2,
    /**
     * Frame for display selection on waypoint
     */
    SelectionFrame: {
      Margin: 2,
      LineWidth: 1,
    }
  },
  Connection: {
    Style: {
      Default: {
        Color: '#e36414',
        LineWidth: 2,
      },
      Selected: {
        Color: '#9a031e',
        LineWidth: 4,
      },
      Undone: {
        Color: '#fb8b24',
        LineWidth: 2,
      }
    },
    DirectionMarkerStyle: {
      Size: 6
    }
  }
};

export const Game = {
  Players: [{
    Size: 0.022,
    Color: '#ff595e',
  }, {
    Size: 0.022,
    Color: '#8ac926',
  }, {
    Size: 0.022,
    Color: '#1982c4',
  }],
  Pentacle: {
    Stones: {
      Energy: {
        Size: 0.028, // relative to board image size
        Color: '#52b788'
      },
      Information: {
        Size: 0.028,
        Color: '#5fa8d3'
      },
      Motivation: {
        Size: 0.028,
        Color: '#e2e2df'
      }
    },
    Rune: {
      Width: 0.044,
      Height: 0.022,
      Color: '#cd9777'
    },
    UfsEvent: {
      Size: 0.014,
      Color: '#b5179e'
    }
  }
};
