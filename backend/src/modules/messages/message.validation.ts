import * as z from "zod";

const typeValidations = z.object({
    receiver_id:z.uuid(),
    content:z.string().trim().min(1).max(5000),
});

export default typeValidations;