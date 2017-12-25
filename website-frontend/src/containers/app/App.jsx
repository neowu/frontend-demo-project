import React from "react";
import PropTypes from "prop-types";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Header from "../Header";
import Nav from "../Nav";
import Welcome from "../Welcome";
import Login from "../Login";
import {Grid} from "semantic-ui-react";

import "./app.scss";

class App extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "CHECK_CURRENT_USER"});
    }

    componentDidCatch(error, info) { // TODO: move this to general Error Component?
        this.props.dispatch({
            type: "ERROR",
            error: info
        });
    }

    render() {
        if (this.props.hasError) {
            return <div>something goes wrong</div>;
        }

        return <BrowserRouter>
            <div>
                <Header/>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column><Nav/></Grid.Column>
                        <Grid.Column>
                            <main>
                                <Switch>
                                    <Route exact path="/" component={Welcome}/>
                                    <Route path="/login" component={Login}/>
                                    <Redirect to="/404"/>
                                </Switch>
                            </main>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </BrowserRouter>;
    }
}

App.propTypes = {
    dispatch: PropTypes.func,
    hasError: PropTypes.bool
};

export default connect(state => ({hasError: state.error.hasError}))(App);
