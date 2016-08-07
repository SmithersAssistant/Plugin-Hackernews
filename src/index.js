import React from 'react'

const BASE = "https://hacker-news.firebaseio.com"
const HACKERNEWS_COMPONENT = 'com.robinmalfait.hn'

export default robot => {

  const { List } = robot.cards
  const { Icon, A } = robot.UI

  const HN = React.createClass({
    getDefaultProps() {
      return {
        itemsToShow: 20
      }
    },
    getInitialState() {
      const { itemsToShow } = this.props

      return {
        itemsToShow,
        loading: true,
        items: []
      }
    },
    componentDidMount() {
      setTimeout(() => {
        const { itemsToShow, loading } = this.state

        if (loading) {
          this.fetchTopStories(items => {
            this.setState({ loading: false })
            items.slice(0, itemsToShow).forEach(id => {
              this.fetchStory(id, story => {
                const { items } = this.state

                items.push(story)

                this.setState({ items })
              })
            })
          })
        }
      }, 800)
    },
    fetchStory(id, done) {
      robot.fetchJson(`${BASE}/v0/item/${id}.json`)
      .then(data => {
        done({
          url: data.url,
          title: data.title,
          by: data.by,
          favicon: robot.faviconUrl(data.url)
        })
      })
    },
    fetchTopStories(done) {
      robot.fetchJson(`${BASE}/v0/topstories.json`)
      .then(data => done(data))
    },
    renderItem(story) {
      return (
        <A target="_blank" href={story.url}>
          {story.favicon
            ? <img style={{ width: '16px', height: '16px' }} src={story.favicon} alt={story.title}/>
            : <Icon icon="globe"/>} {story.title} - {story.by}
        </A>
      )
    },
    render() {
      const { ...other } = this.props
      const { loading } = this.state

      const items = loading ? [<h3>Loading...</h3>] : this.state.items.map(this.renderItem)

      return (
        <List {...other} title="Hackernews" items={items}/>
      )
    }
  })

  robot.registerComponent(HN, HACKERNEWS_COMPONENT);

  robot.listen(/^hn ?(.*)?$/, {
    description: "Hackernews",
    usage: 'hn <items_to_show?>'
  }, (res) => {
    robot.addCard(HACKERNEWS_COMPONENT, {
      itemsToShow: res.matches[1] || 20
    })
  })
}
