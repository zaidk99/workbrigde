import * as z from "zod";

const typeValidations = z.object({
    sender_id: z.uuid(),
    reciever_id:z.uuid(),
    content:z.string().trim().min(1).max(5000),
})