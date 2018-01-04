import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Form, Radio} from "antd";

class AddProduct extends React.PureComponent {
    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((errors, values) => {
            console.info(values);
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const typeDecorator = getFieldDecorator("type");

        return <div>
            <Form onSubmit={this.onSubmit}>
                <Form.Item>
                    {typeDecorator(<Radio.Group>
                        {
                            this.props.types.map(type => <Radio.Button key={type.value} value={type.value}>{type.name}</Radio.Button>)
                        }
                    </Radio.Group>)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Create</Button>
                </Form.Item>
            </Form>
        </div>;
    }
}

AddProduct.propTypes = {
    dispatch: PropTypes.func,
    types: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string
    })),
    form: PropTypes.object
};

export default connect(state => ({
    types: state.product.createProductUI.types
}))(Form.create()(AddProduct));
