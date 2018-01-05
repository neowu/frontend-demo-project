import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Form, Radio} from "antd";

const AddProduct = ({ui, form, dispatch}) => {
    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields((errors, values) => {
            console.info(values);
        });
    };

    const typeDecorator = form.getFieldDecorator("type");

    return <div>
        <Form onSubmit={onSubmit}>
            <Form.Item>
                {typeDecorator(<Radio.Group>
                    {
                        ui.types.map(type => <Radio.Button key={type.value} value={type.value}>{type.name}</Radio.Button>)
                    }
                </Radio.Group>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Create</Button>
            </Form.Item>
        </Form>
    </div>;
};

AddProduct.propTypes = {
    dispatch: PropTypes.func,
    ui: PropTypes.shape({
        types: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string
        }))
    }),
    form: PropTypes.object
};

export default connect(state => ({
    ui: state.product.createProductUI
}))(Form.create()(AddProduct));
