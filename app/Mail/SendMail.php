<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $attachment;
    public $view;
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data, $attachment, $view, $subject)
    {
        $this->data = $data;
        $this->attachment = $attachment;
        $this->view = $view;
        $this->subject = $subject;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $email = $this->subject($this->subject)->view($this->view);

        // $attachments is an array with file paths of attachments
        foreach($this->attachment as $file_path)
        {
            $email->attach($file_path);
        }

        return $email;
    }
}