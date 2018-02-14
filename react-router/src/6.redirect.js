/**
 * Created by 王冬 on 2018/2/14.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React from 'react'
import {HashRouter as Router, Link, Redirect, Route, withRouter} from 'react-router-dom'

const AuthExample = props => (
    <Router>
        <div>
            <AuthButton/>
            <ul>
                <li><Link to={`${props.match.url}/public`}>Public Page</Link></li>
                <li><Link to={`${props.match.url}/protected`}>Protected Page</Link></li>
            </ul>
            <Route path={`${props.match.url}/public`} component={Public}/>
            <Route path={`${props.match.url}/login`} component={Login}/>
            <PrivateRoute path={`${props.match.url}/protected`} component={Protected}/>
        </div>
    </Router>
)

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100) // fake async
    },
    signout(cb) {
        this.isAuthenticated = false
        setTimeout(cb, 100)
    }
}

const AuthButton = withRouter(({history}) => {
    return (
        fakeAuth.isAuthenticated ? (
            <p>
                Welcome! <button onClick={() => {
                fakeAuth.signout(() => history.push('/'))
            }}>Sign out</button>
            </p>
        ) : (
            <p>You are not logged in.</p>
        )
    )
})

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        return fakeAuth.isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: `${props.match.url.replace(/\/[^/]+$/, '')}/login`,
                state: {from: props.location}
            }}/>
        )
    }}/>
)


const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    }

    login = () => {
        fakeAuth.authenticate(() => {
            this.setState({redirectToReferrer: true})
        })
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        const {redirectToReferrer} = this.state
        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        )
    }
}

export default AuthExample