import DefaultTheme from 'vitepress/theme'

import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'
import Comment from './components/Comment.vue'
import PreviewCode from './components/PreviewCode.vue'

import './custom.css'

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app, router }) {
        // register global compoment
        app.component('Tags', Tags)
        app.component('Archives', Archives)
        app.component('Page', Page)
        app.component('Comment', Comment)
        app.component('PreviewCode', PreviewCode)

        router.onBeforeRouteChange = (path) => {
            if (typeof _hmt != "undefined") {
                if (path) {
                  _hmt.push(["_trackPageview", path]);
                }
            }
        };
    }
}
