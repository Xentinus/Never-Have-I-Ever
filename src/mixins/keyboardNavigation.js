export const keyboardNavigation = {
  data() {
    return {
      currentFocusIndex: 0,
      navigationButtons: [],
      isKeyboardNavigation: false
    }
  },
  mounted() {
    this.navigationButtons = Array.from(this.$el.getElementsByTagName('button'))
    
    if (this.navigationButtons.length > 0) {
      this.navigationButtons[0].focus()
      this.isKeyboardNavigation = true
    }
    
    this.$el.addEventListener('keydown', this.handleKeyNavigation)
    this.$el.addEventListener('mousedown', this.handleMouseDown)
    this.$el.addEventListener('focusout', this.handleFocusOut)
  },
  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.handleKeyNavigation)
    this.$el.removeEventListener('mousedown', this.handleMouseDown)
    this.$el.removeEventListener('focusout', this.handleFocusOut)
  },
  methods: {
    handleMouseDown(event) {
      if (event.target.tagName === 'BUTTON') {
        this.isKeyboardNavigation = false
        return
      }
      
      event.preventDefault()
      if (this.navigationButtons[this.currentFocusIndex]) {
        this.navigationButtons[this.currentFocusIndex].focus()
      }
    },
    handleFocusOut(event) {
      if (!event.relatedTarget || !this.navigationButtons.includes(event.relatedTarget)) {
        if (this.isKeyboardNavigation && this.navigationButtons[this.currentFocusIndex]) {
          this.navigationButtons[this.currentFocusIndex].focus()
        }
      }
    },
    handleKeyNavigation(event) {
      this.isKeyboardNavigation = true
      this.navigationButtons = Array.from(this.$el.getElementsByTagName('button'))
      const totalButtons = this.navigationButtons.length
      
      if (totalButtons === 0) return

      const currentRect = this.navigationButtons[this.currentFocusIndex].getBoundingClientRect()

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          this.currentFocusIndex = (this.currentFocusIndex + 1) % totalButtons
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.currentFocusIndex = (this.currentFocusIndex - 1 + totalButtons) % totalButtons
          break
        case 'ArrowDown': {
          event.preventDefault()
          // Find the button in the next row that's closest horizontally
          const nextRowY = currentRect.top + currentRect.height + 5 // Add small tolerance
          let bestMatch = null
          let bestDistance = Infinity

          this.navigationButtons.forEach((button, index) => {
            const rect = button.getBoundingClientRect()
            if (rect.top > nextRowY) {
              const horizontalDistance = Math.abs(rect.left - currentRect.left)
              if (horizontalDistance < bestDistance) {
                bestDistance = horizontalDistance
                bestMatch = index
              }
            }
          })

          if (bestMatch !== null) {
            this.currentFocusIndex = bestMatch
          }
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          // Find the button in the previous row that's closest horizontally
          const prevRowY = currentRect.top - 5 // Add small tolerance
          let bestMatch = null
          let bestDistance = Infinity

          this.navigationButtons.forEach((button, index) => {
            const rect = button.getBoundingClientRect()
            if (rect.top < prevRowY) {
              const horizontalDistance = Math.abs(rect.left - currentRect.left)
              if (horizontalDistance < bestDistance) {
                bestDistance = horizontalDistance
                bestMatch = index
              }
            }
          })

          if (bestMatch !== null) {
            this.currentFocusIndex = bestMatch
          }
          break
        }
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (this.navigationButtons[this.currentFocusIndex]) {
            this.navigationButtons[this.currentFocusIndex].click()
            setTimeout(() => {
              this.navigationButtons = Array.from(this.$el.getElementsByTagName('button'))
              if (this.navigationButtons.length > 0) {
                this.currentFocusIndex = Math.min(this.currentFocusIndex, this.navigationButtons.length - 1)
                this.navigationButtons[this.currentFocusIndex].focus()
              }
            }, 0)
          }
          break
      }
      
      if (event.key !== 'Enter' && event.key !== ' ' && this.navigationButtons[this.currentFocusIndex]) {
        this.navigationButtons[this.currentFocusIndex].focus()
      }
    },
    getRowLength() {
      if (this.navigationButtons.length === 0) return 1
      
      const firstButton = this.navigationButtons[0]
      const firstRect = firstButton.getBoundingClientRect()
      
      let rowLength = 0
      for (const button of this.navigationButtons) {
        const rect = button.getBoundingClientRect()
        if (Math.abs(rect.top - firstRect.top) < 10) {
          rowLength++
        } else {
          break
        }
      }
      
      return rowLength || 1
    }
  }
}