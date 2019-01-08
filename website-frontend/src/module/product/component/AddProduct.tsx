import {Button, Form, Radio} from "antd";
import {FormComponentProps} from "antd/lib/form";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import {RootState} from "type/state";

interface StateProps {
    ui: {
        types: Array<{
            name: string;
            value: string;
        }>;
        now: Date | null;
    };
}

interface Props extends StateProps, FormComponentProps, DispatchProp {}

const AddProduct: React.SFC<Props> = ({ui, form}) => {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.validateFields((errors, values) => {
            // console.info(values);
        });
    };

    const typeDecorator = form.getFieldDecorator("type");

    return (
        <div>
            <h1>{ui.now == null ? "" : ui.now.toDateString()}</h1>
            <Form onSubmit={onSubmit}>
                <Form.Item>
                    {typeDecorator(
                        <Radio.Group>
                            {ui.types.map(type => (
                                <Radio.Button key={type.value} value={type.value}>
                                    {type.name}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        ui: state.app.product.createProductUI,
    };
};

export default connect(mapStateToProps)(Form.create()(AddProduct));
