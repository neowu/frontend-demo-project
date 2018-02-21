import React from "react";
import {connect} from "react-redux";
import {Button, Form, Radio} from "antd";

interface Props {
    ui: {
        types: Array<{
            name: string;
            value: string;
        }>;
    };
    form: any;
}

const AddProduct: React.SFC<Props> = ({ui, form}) => {
    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields((errors, values) => {
            // console.info(values);
        });
    };

    const typeDecorator = form.getFieldDecorator("type");

    return <div>
        <Form onSubmit={onSubmit}>
            <Form.Item>
                {typeDecorator(<Radio.Group>
                    {ui.types.map((type) => <Radio.Button key={type.value} value={type.value}>{type.name}</Radio.Button>)}
                </Radio.Group>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Create</Button>
            </Form.Item>
        </Form>
    </div>;
};

export default connect((state: any) => ({
    ui: state.product.createProductUI
}))(Form.create()(AddProduct));
