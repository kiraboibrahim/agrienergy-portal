import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/joy";
import { Form, Formik, useFormikContext } from "formik";
import PromotionSchema, {
  ALL_FARMERS_RECIPIENT,
  ALL_GROUPS_RECIPIENT,
  GROUP_RECIPIENT,
} from "../../validation-schemas/product/PromotionSchema";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import toTitleCase from "../../utils/toTitleCase";
import RadioInput from "../common/fields/RadioInput";
import Textarea from "../common/fields/Textarea";
import GroupSelect from "../common/fields/GroupSelect";
import usePromoteProduct from "../../hooks/usePromoteProduct";

export default function PromoteProductForm({ product }) {
  const [promoteProduct, isPromotingProduct] = usePromoteProduct(product);
  return (
    <Box>
      <Card
        variant="soft"
        orientation="horizontal"
        sx={{ marginBottom: 3, overflow: "hidden" }}
      >
        <CardContent orientation="horizontal">
          <Avatar size="lg" src={resolvePhotoSrc(product.coverPhoto)}>
            {product.name}
          </Avatar>
          <Box>
            <Typography level="h3">{toTitleCase(product.name)}</Typography>

            <Box level="body-xs" sx={{ marginTop: 1 }}>
              {product.categories.map(({ name }, index) => (
                <Chip
                  size="sm"
                  key={index}
                  color="success"
                  sx={{ marginRight: 1, overflow: "scroll" }}
                >
                  {name}
                </Chip>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Formik
        validationSchema={PromotionSchema}
        initialValues={{
          recipient: "",
          group: [],
          message: "",
        }}
        onSubmit={async (values) => {
          await promoteProduct(product.id, values);
        }}
      >
        <Form>
          <RadioInput
            name="recipient"
            label="Send promotion to"
            options={{
              [ALL_FARMERS_RECIPIENT]: "All farmers",
              [ALL_GROUPS_RECIPIENT]: "All groups",
              [GROUP_RECIPIENT]: "Select group",
            }}
            required
            sx={{ marginBottom: 1 }}
          ></RadioInput>
          <DependentGroupSelect />
          <Textarea
            name="message"
            label="Message"
            required
            sx={{ marginTop: 2 }}
          />
          <Button
            type="submit"
            sx={{ marginTop: 2, borderRadius: "lg", width: "100%" }}
            color="success"
            loadingPosition="start"
            loading={isPromotingProduct}
            disabled={isPromotingProduct}
          >
            Promote
          </Button>
        </Form>
      </Formik>
    </Box>
  );
}

function DependentGroupSelect() {
  const {
    values: { recipient },
  } = useFormikContext();

  return recipient === GROUP_RECIPIENT ? (
    <GroupSelect name="group" label="" placeholder="Search groups" />
  ) : (
    <></>
  );
}
