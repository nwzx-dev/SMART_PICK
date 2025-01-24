import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"

const formSchema = z.object({
    parent_name: z.string().min(4, {
        message: "Parent name must be at least 4 characters.",
    }),
    parent_email: z.string().email({
        message: "Parent email must be a valid email address.",
    }),
    parent_phone_number: z.string().regex(/^\d{10}$/, {
        message: "Parent phone number must be a 10-digit number.",
    }),
    parent_pickup_code: z.string().min(4, {
        message: "Parent pickup code is required.",
    }),
    child_name: z.string().min(4, {
        message: "Child name must be at least 4 characters.",
    }),
    parent_img_url: z.any().optional(),
    child_img_url: z.any().optional(),
})

export default function AddRecords() {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            parent_name: "",
            parent_email: "",
            parent_phone_number: "",
            parent_pickup_code: "",
            child_name: "",
            parent_img_url: [],
            child_img_url: []
        }
    })

    // 2. Define a submit handler.
    function onSubmit(value: FieldValues) {

        const formData1 = new FormData();
        const formData2 = new FormData();
        formData1.append("Child", value.child_img_url);
        formData2.append("Parent", value.parent_img_url);

        (async () => {
            const data = await axios.post("/api/records/uploadChild", formData1, {
                headers: {
                    "Content-type": 'multipart/form-data; boundary=--------------------------585591568098780255545610'
                },
            })
            const data1 = await axios.post("/api/records/uploadParent", formData2, {
                headers: {
                    "Content-type": 'multipart/form-data; boundary=--------------------------585591568098780255545610'
                },
            })

            if (!data.data.fileName && !data1.data.fileName) {
                return alert("error")
            } else {
                const str1 = location.host + "/img/Child/" + data.data.fileName;
                const str2 = location.host + "/img/Parent/" + data1.data.fileName;

                form.setValue("parent_img_url", str1 as unknown as never[])
                form.setValue("child_img_url", str2 as unknown as never[])

                console.log(form.getValues())

                axios.post("/api/records", form.getValues())
                    .then(ans => {
                        console.log(ans)
                    }).catch(err => {
                        console.log(err)
                    })

            }
        })()
    }
    return (
        <div className=" w-full flex justify-center items-center">
            <div className=" w-[30rem] ">
                <div className=" pb-9 pt-9">
                    <h1 className=" text-2xl font-semibold"> Add New Records</h1>
                    <p className=" text-sm">This will add new data to the Records Table</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="parent_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter parent name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parent_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter parent email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parent_phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="Enter parent phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parent_pickup_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Pickup Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter pickup code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="child_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Child Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter child name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parent_img_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                field.onChange(e.target.files?.[0] || null)
                                            }

                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="child_img_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Child Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                field.onChange(e.target.files?.[0] || null)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}


