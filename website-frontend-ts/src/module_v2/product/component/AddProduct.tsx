import React from "react";
import {connect} from "react-redux";
import {Button, Form, Radio} from "antd";
import {RootState} from "model/state";
import {FormComponentProps} from "antd/lib/form";
import {Dispatch} from "redux";

interface Props extends FormComponentProps {
    ui: {
        types: Array<{
            name: string;
            value: string;
        }>;
    };
}

const AddProduct: React.SFC<Props> = ({ui, form}) => {
    const onSubmit = event => {
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
                    {ui.types.map(type => <Radio.Button key={type.value} value={type.value}>{type.name}</Radio.Button>)}
                </Radio.Group>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Create</Button>
            </Form.Item>
        </Form>
    </div>;
};

const mapStateToProps = (state: RootState) => ({
    ui: state.app.product.createProductUI
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        dispatch
    };
};

const wrappedComponent = Form.create()(AddProduct);
export default connect(mapStateToProps, mapDispatchToProps)(wrappedComponent as any);
