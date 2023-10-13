'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Heading from '@/components/heading';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useState } from 'react';

import { formSchema } from './constants';

const VideoPage = () => {
  const [video, setVideo] = useState<string>();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post('/api/video', values);

      setVideo(response.data[0]);

      form.reset();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Video Generation'
        description='Turn your prompt into video.'
        icon={VideoIcon}
        iconColor='text-orange-700'
        bgColor='bg-orange-700/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
            >
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='Clown fish swimming around a coral reef.'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className='col-span-12 lg:col-span-2'>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader />
            </div>
          )}
          {!video && !isLoading && <Empty label='No video generated.' />}
          {video && (
            <video controls className='w-full mt-8 aspect-video rounded-lg border bg-black'>
              <source src={video} />
              <track kind='captions' srcLang='en' label='English Captions' />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;