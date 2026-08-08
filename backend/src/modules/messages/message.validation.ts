import * as z from "zod";

const typeValidations = z.object({
    sender_id: z.uuid(),
    reciever_id:z.uuid(),
})